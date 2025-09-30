from setuptools import setup, find_packages

setup(
    name="studio-sdk",
    version="1.0.0",
    description="LinTO Studio SDK",
    packages=find_packages(),
    install_requires=[
        "aiohttp",
    ],
)
