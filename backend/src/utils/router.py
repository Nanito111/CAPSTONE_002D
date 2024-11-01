from logging import getLogger
from fastapi import APIRouter
from sqlalchemy import select

from dependencies import SessionDataBase
from models import Comuna, Country, ElectricityCompany, Region
from utils import schemas

logger = getLogger("utils.router")

router = APIRouter(prefix="/utils", tags=["utils"])


@router.get("/get-countries")
def get_countries(
    database_session: SessionDataBase,
):
    statement = select(Country)
    rows = database_session.execute(statement).scalars().all()
    countries_as_obj = [country.__dict__ for country in rows]

    return schemas.GetNameAndIdList.model_validate(countries_as_obj)


@router.get("/get-regions")
def get_regions(
    database_session: SessionDataBase,
    country: str,
):
    statement = select(Region).where(Region.id_country.__eq__(country))
    rows = database_session.execute(statement).scalars().all()
    regions_as_obj = [region.__dict__ for region in rows]

    return schemas.GetNameAndIdList.model_validate(regions_as_obj)


@router.get("/get-comuna")
def get_comuna(
    database_session: SessionDataBase,
    region: str,
):
    statement = select(Comuna).where(Comuna.id_region.__eq__(region))
    rows = database_session.execute(statement).scalars().all()
    comuna_as_obj = [comuna.__dict__ for comuna in rows]

    return schemas.GetNameAndIdList.model_validate(comuna_as_obj)


@router.get("/get-empresas")
def get_empresas(
    database_session: SessionDataBase,
):
    statement = select(ElectricityCompany)
    rows = database_session.execute(statement).scalars().all()
    empresas_as_obj = [empresa.__dict__ for empresa in rows]

    return schemas.GetNameAndIdList.model_validate(empresas_as_obj)
