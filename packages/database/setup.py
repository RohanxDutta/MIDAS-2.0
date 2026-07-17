from setuptools import setup, find_packages

setup(
    name="midas-database",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "sqlmodel>=0.0.19",
        "psycopg2-binary>=2.9.9",
        "alembic>=1.13.1"
    ]
)
