from setuptools import setup, find_packages

setup(
    name="LinTO",
    version="1.0.0",
    description="LinTO Studio SDK",
    packages=find_packages(),
    install_requires=[
        "aiohttp",
    ],
)
