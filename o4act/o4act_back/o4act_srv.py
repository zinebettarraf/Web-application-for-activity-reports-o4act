import logging
import os
import json
import traceback
import psycopg2.extras
import tornado.httpserver
import tornado.ioloop
import tornado.web
import fournaise.tornado.utils.pgutils as pgutils 
from fournaise.utils.jsonutils import jsondec, jsonenc
from tornado.options import define, options, parse_command_line
from tornado.web import gen



from webservices import login,saisieRA,ajoutUser,getUsers,DoesUserExist,DoesRAExist,getPage,lastDate


define("dbpwd", default='orika', help="db password", type=str)
define("dbmaxconn", default=10, help="maximum db connections", type=int)
define("port", default=4000, help="run on the given secure port", type=int)
define("listen_address", default='0.0.0.0', help="listen address", type=str)
define("dbuser", default='orka', help="db user", type=str)
define("dbport", default=5432, help="db port", type=int)   #port postgres
define("dbname", default='o4act', help="db name", type=str)
define("dbhost", default='localhost', help="db host", type=str)
parse_command_line()

ROOTPATH = os.path.dirname(os.path.abspath(__file__))




db = pgutils.DB(options.dbuser, options.dbpwd, options.dbname,options.dbhost, options.dbport, max_size=options.dbmaxconn) 
# equivalent con avec cur 

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin',
                        'http://localhost:19006')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Allow-Credentials', 'true')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, Access-Control-Allow-Methods')

    def initialize(self, db):
        self.db = db

    def get_current_user(self):
        logging.info(
            f" current session cookie :  {self.get_secure_cookie('session')}")
        return self.get_secure_cookie("session")



class IndexHandler(BaseHandler):

    @gen.coroutine
    def post(self , path=''):
        logging.info(f"POST {path}")

        try:
        
            data = self.request.body.decode('utf-8')
            resp = json.loads(data)
            
            if path == "login":
                res = yield login(self, self.db, resp)
                if (  (res is not  None ) and  (res !=[]) ):
                    res=dict(response=True,role=res[0]["role"])
                else:
                    self.set_status(500)
                    res=dict(response=False)
                self.write(jsonenc(res))
            
            if path=="lastDate":
                res = yield lastDate(self, self.db, resp)
                if(res!=[]):
                    res=dict(lastDate=res[0]["date"])
                else:
                    res=dict(lastDate="")
                self.write(jsonenc(res))
                
            if path=="getUsers":
                res = yield getUsers(self, self.db, resp)
                L=[]
                for user in res:
                    L.append([user["username"],])
                self.write(jsonenc(L))

            if path=="saisieRA":
                res=yield DoesRAExist(self, self.db, resp)
                if(res!=[]):
                    self.set_status(500)
                    self.write({"error":1})
                else:
                    yield saisieRA(self, self.db, resp)  
                    self.write({"error":0})
            
            if path=="getPage":
                res=yield getPage(self, self.db, resp)
                nrows=res[1]
                res=res[0]
                L=[]
                if(res!=[]):
                    for rapport in res :
                        L.append([rapport["username"],rapport["date"].strftime("%d/%m/%Y"),rapport["rd_date"].strftime("%d/%m/%Y %H:%M"),rapport["motifretard"],rapport["task"]])   # important le truc de conversion js ne connait pas data.time error :(1h
                L = [nrows,L]
                self.write(jsonenc(L))   
            
            if path=="ajoutUser":
                res=yield DoesUserExist(self, self.db, resp)
                if(res!=[]):
                    self.set_status(500)
                    self.write({"error":1})
                else:
                    yield ajoutUser(self, self.db, resp)  
                    self.write({"error":0})



        except:
            traceback.print_exc()

            
    @gen.coroutine
    def get(self , path = ''):
        if path == 'o4act':
            self.render("index.html")


def main():

    settings = dict(
        debug=True,
        static_path=os.path.join(ROOTPATH, "web"),
        template_path=os.path.join(ROOTPATH, "web"),
        cookie_secret="u5SXVuerTfyQTT7uTbu7HjqiqHnh8UsBm37J4Y5lwto=",
    )

    opts = dict(db=db)
    application = tornado.web.Application([
        (r"/(.*)", IndexHandler , opts),
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(4000)
    logging.info('Listening on {}'.format(4000))
    tornado.ioloop.IOLoop.instance().start()

    

if __name__ == '__main__':
    main()