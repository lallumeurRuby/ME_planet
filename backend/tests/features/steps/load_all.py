"""Behave 只載入 steps/ 第一層的 .py；此檔遞迴匯入子目錄中的 step 模組。"""

import importlib
import pkgutil
from pathlib import Path

_STEPS_DIR = Path(__file__).parent

for module in pkgutil.walk_packages([str(_STEPS_DIR)]):
    if module.name != "load_all":
        importlib.import_module(module.name)
