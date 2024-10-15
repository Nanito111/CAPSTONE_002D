class UnsupportedDatabaseEngineError(Exception):
    def __init__(self):
        self.message = "Motor de Base de Datos no es compatible."

    def __str__(self):
        return repr(self.message)
