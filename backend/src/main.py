from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import constants
from health_check.router import router as health_check_router
from utils.router import router as utils_router
from account.router import router as account_router
from devices.router import router as devices_router

app = FastAPI(
    title=constants.PROJECT_NAME,
    version=constants.PROJECT_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_check_router)
app.include_router(utils_router)
app.include_router(account_router)
app.include_router(devices_router)
