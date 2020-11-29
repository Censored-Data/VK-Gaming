from library import config, get_recomendation_games, get_recomendation_users, get_cs_team
from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
from urllib.parse import urlparse, parse_qs
import json

import pandas as pd
from sklearn.neighbors import NearestNeighbors
import pickle
import json

new_data = pd.read_csv('new_data.csv', index_col=0)
model = pickle.load(open('model.sav', 'rb'))
import requests

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):          

    def do_GET(self):
        self.send_response(200)
        self.end_headers()

        print(self.path)
        print(urlparse(self.path).query);

        print(self.headers);

        query_components = parse_qs(urlparse(self.path).query)
                
        user_id    =  self.headers['user_id'] 
        path       =  self.headers['path'] 
        
        return_data = ''

        if path == 'user_recomendation':
            return_data = json.dumps(json.loads(get_recomendation_users(user_id))['id'])

        if path == 'game_recomendation':
           return_data = json.dumps(json.loads(get_recomendation_games(user_id)))
           print(return_data)
        if path == 'cs_team':
            return_data = get_cs_team(user_id)

        response = BytesIO()
        response.write(return_data.encode())                   
        self.wfile.write(response.getvalue())

httpd = HTTPServer(('217.107.219.115', 4002), SimpleHTTPRequestHandler)
httpd.serve_forever()