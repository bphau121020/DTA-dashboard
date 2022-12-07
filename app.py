import collections
import json
from statistics import mean, stdev, variance
import pandas as pd
from flask import *
import config
import store
from solver import solve as sv
from store import CustomEncoder, Input, Reviews

firebase = config.connection()
app = Flask(__name__)
app.secret_key = "Abcd1234"
sentiment = ['entertainment', 'accommodation',
             'restaurant_serving', 'food', 'traveling', 'shopping']


def save_df(df, id):
    postdata = df.to_dict()
    for i in sentiment:
        postdata[i] = {key: val for key,
                       val in postdata[i].items() if val != 0}
    result = firebase.put("/input", id, postdata)


def create_new(df):
    df2 = pd.DataFrame()
    df2["review"] = df["Comment"]
    df2["place_id"] = df["Country"]
    df2["entertainment"] = df["Entertainment"]
    df2["accommodation"] = df["Accommodation"]
    df2["restaurant_serving"] = df["Restaurant_Serving"]
    df2["food"] = df["Food"]
    df2["traveling"] = df["Traveling"]
    df2["shopping"] = df["Shopping"]
    df2["status"] = False
    grouped = df2.groupby(df2.place_id)
    country_code = df2["place_id"].to_list()
    country_code = list(set(country_code))
    if(len(country_code) != int(len(firebase.get("/place",None)))-1):
        return False
    for i in country_code:
        df_new = grouped.get_group(int(i))  
        save_df(df_new, i)
    return True


def query(page, typ_inp):
    val = firebase.get("/input/" + str(page), typ_inp)
    return val


def get_value_by_status(dic, status):
    temp = []
    for x, y in dic.items():
        if x not in status:
            temp.append(y)
    return temp


def save_cal(page, an_uong_cal, di_chuyen_cal, giai_tri, luu_tru, mua_sam, nha_hang):
    dict_save = {
        "mean": {
            "food": mean(an_uong_cal),
            "traveling": mean(di_chuyen_cal),
            "entertainment": mean(giai_tri),
            "accommodation": mean(luu_tru),
            "shopping": mean(mua_sam),
            "restaurant_serving": mean(nha_hang)
        },
        "std": {
            "food": stdev(an_uong_cal),
            "traveling": stdev(di_chuyen_cal),
            "entertainment": stdev(giai_tri),
            "accommodation": stdev(luu_tru),
            "shopping": stdev(mua_sam),
            "restaurant_serving": stdev(nha_hang)
        },
        "var": {
            "food": variance(an_uong_cal),
            "traveling": variance(di_chuyen_cal),
            "entertainment": variance(giai_tri),
            "accommodation": variance(luu_tru),
            "shopping": variance(mua_sam),
            "restaurant_serving": variance(nha_hang)
        },
    }
    result = firebase.put("/cal", page, dict_save)


def get_max(dict_max):
    l = []
    d = collections.defaultdict(dict)
    for i in sentiment:
        for j in range(1, 6):
            l.append(dict_max[j][i])
        mx = max(l)
        idx = l.index(mx)
        val = firebase.get(("/place"), idx+1)
        d['value'] = mx
        d['place_name'] = val
        l.clear()
        result = firebase.put("/max", i, d)
        d.clear()

@app.route("/")
def hello():
    return redirect("http://localhost:3000/", code=302)


@app.route("/confirm", methods=["POST"])
def upload():
    file = request.files["file"]
    if file:
        df = pd.read_csv(file, index_col=False)
        df = df.dropna()
        store.DBL.clear()
        for i in range(0, len(df)):
            store.DBL.append(Reviews(Comment=df.loc[i].Comment, Entertainment=df.loc[i].Entertainment, Accommodation=df.loc[i].Accommodation,
                                     Restaurant_Serving=df.loc[i].Restaurant_Serving, Food=df.loc[i].Food, Traveling=df.loc[i].Traveling,
                                     Shopping=df.loc[i].Shopping, Country=df.loc[i].Country))
        res = create_new(df)
        if res:
            return "http://localhost:3000/list"
    flash("fail")
    return "Not enough data to calculate!"


@app.route("/api")
def read_root():
    the_value = store.DBL
    jsonized = json.dumps([ob.__dict__ for ob in the_value])
    return jsonized


@app.route("/cal", methods=["GET"])
def cal():
    dic_max = collections.defaultdict(dict)
    status = []
    an_uong = []
    di_chuyen = []
    giai_tri = []
    luu_tru = []
    mua_sam = []
    nha_hang = []
    for i in range(1, int(len(firebase.get("/place", None)))):
        boo_val = query(i, "status")
        for x, y in boo_val.items():
            if y == True:
                status.append(x)
        an_uong = get_value_by_status(query(i, "food"), status)
        di_chuyen = get_value_by_status(query(i, "traveling"), status)
        giai_tri = get_value_by_status(query(i, "entertainment"), status)
        luu_tru = get_value_by_status(query(i, "accommodation"), status)
        mua_sam = get_value_by_status(query(i, "shopping"), status)
        nha_hang = get_value_by_status(query(i, "restaurant_serving"), status)
        dic_max[i]['food'] = mean(an_uong)
        dic_max[i]['traveling'] = mean(di_chuyen)
        dic_max[i]['entertainment'] = mean(giai_tri)
        dic_max[i]['accommodation'] = mean(luu_tru)
        dic_max[i]['shopping'] = mean(mua_sam)
        dic_max[i]['restaurant_serving'] = mean(nha_hang)
        save_cal(i, an_uong, di_chuyen, giai_tri, luu_tru, mua_sam, nha_hang)
    get_max(dic_max)
    return "Complete the calculation and send the data to the server!"
@app.post("/index")
def getdata():
    RATING_ASPECTS = ["Giải trí", "Lưu trú",
                      "Nhà hàng", "Ăn uống", "Di chuyển", "Mua sắm"]
    if request.method == "POST":
        try:
            review_sentence = request.form["review"]
            review_country = request.form["country"]
            data = []

            # predict aspect and rating
            predict_results = sv(review_sentence)
            pre_result_copy = predict_results.copy()

            # Insert review to predict list
            pre_result_copy.insert(0, review_sentence)

            i = 0
            while i < len(predict_results):
                if predict_results[i] != 0:
                    predict_results[i] = str(predict_results[i])
                i += 1
            result = {
                    "Comment": review_sentence,
                    "Entertainment": predict_results[0],
                    "Accommodation": predict_results[1],
                    "Restaurant_Serving": predict_results[2],
                    "Food": predict_results[3],
                    "Traveling": predict_results[4],
                    "Shopping": predict_results[5],
                    "Country": review_country
            }
            store.DBI.append(Input(Comment=review_sentence,
                             Entertainment=predict_results[0],
                             Accommodation=predict_results[1],
                             Restaurant_Serving=predict_results[2],
                             Food=predict_results[3],
                             Traveling=predict_results[4],
                             Shopping=predict_results[5],
                             Country=review_country
                                   ))
            data = dict(zip(RATING_ASPECTS, predict_results))
            data.update()
            data = pd.DataFrame([data])
            review_sentence = '" ' + review_sentence + ' "'
            return json.dumps(result)
        except:
            review_sent = request.form["review"]
            return review_sent


@app.route("/get-list", methods=["GET"])
def get_list():
    the_value = store.DBI
    jsonized = json.dumps([ob.__dict__ for ob in the_value])
    return jsonized


if __name__ == "__main__":
    app.run(debug=True)
