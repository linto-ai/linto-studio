cp ../README.md README.md
python3 -m build
python3 -m twine upload dist/*
