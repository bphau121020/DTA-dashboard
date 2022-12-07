
from pydantic import BaseModel
from typing import List
import json
class Reviews(BaseModel):
    Comment: str
    Entertainment: float
    Accommodation: float
    Restaurant_Serving: float
    Food: float
    Traveling: float
    Shopping: float
    Country: float


DBL: List[Reviews] = []

class Input(BaseModel):
    Comment: str
    Entertainment: str | float
    Accommodation: str | float
    Restaurant_Serving: str | float
    Food: str | float
    Traveling: str | float
    Shopping: str | float
    Country: str | float


DBI: List[Input] = []

class CustomData:
    def __init__(self, name, value):
        self.name = name
        self.value = value
class CustomEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__