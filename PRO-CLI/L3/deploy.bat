@echo off
REM Flask 应用一键启动脚本 (Windows)
REM 用法: deploy.bat

echo ========================================
echo   学生信息管理 API - 启动脚本
echo ========================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.8+
    pause
    exit /b 1
)

REM 检查 Flask
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo [提示] 正在安装 Flask...
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ flask flask-cors
)

REM 启动应用
echo [启动] Flask 应用正在启动...
echo.
python app.py
