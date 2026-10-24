class AppError(Exception):
    """對應 api.yml Error schema：{ code, message }。"""

    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
        super().__init__(f"{code}: {message}")
