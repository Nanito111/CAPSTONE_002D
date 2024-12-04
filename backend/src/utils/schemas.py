from typing import List
from pydantic import BaseModel, Field, RootModel


class GetNameAndIdList(RootModel):
    class NameAndId(BaseModel):
        id: str = Field(coerce_numbers_to_str=True)
        name: str

    root: List[NameAndId]
