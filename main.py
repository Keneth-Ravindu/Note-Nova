#This is the file which will be used when we want to run, start webserver or start website
from website import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

