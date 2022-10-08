import logging
from tornado.web import gen
import datetime
import traceback
import os
import pendulum
 


@gen.coroutine
def login(self, oriane ,resp):  
    q = "select * from Utilisateur where username='"+resp["username"]+"' and password='"+resp["password"]+"' ;"
    res = yield oriane.select(q)
    return res

@gen.coroutine
def lastDate(self, oriane ,resp):  
    q = " SELECT * FROM rapport WHERE date = (SELECT MAX(date) FROM rapport);"
    res = yield oriane.select(q)
    return res

@gen.coroutine
def saisieRA(self, oriane ,resp): 
    q0="SELECT COALESCE(MAX(idr), 0) AS max From rapport;"
    res0 = yield oriane.select(q0)
    next =res0[0]["max"]+1
    data =[]
    data.append(dict(idr=str(next),username=resp["username"],date=resp["date"],rd_date=resp["radate"],task=resp["text"], motifretard=resp["retard"]))
    yield oriane.upsert('rapport',data)



   


@gen.coroutine
def getPage(self, oriane ,resp):
    today = pendulum.now()
    start = today.start_of('week')
    end = today.end_of('week')
    endlastweek=today.start_of('week').subtract(days=1)
    startlastweek=endlastweek.subtract(days=6)
    q="select * from rapport where username='{}' and ".format(resp["employe"]) if (resp["employe"]!="") else "select * from rapport where  "

    # gestion de plusieurs motscles 

    if(resp["motscle"]!=""):
        motscles=resp["motscle"].split(" ")
        n=len(motscles)
        i=0
        while(n!=0):
            q+="(motifretard ilike '%{}%' or task ilike '%{}%') and ".format(motscles[i],motscles[i])
            n-=1    
    if(resp["isSelectedtoday"] or resp["isSelectedweek"] or resp["isSelectedlastweek"]):
        q+="date = '{}'".format(today) if resp["isSelectedtoday"] else ""
        q+="(date between '{}' and '{}')".format(start,end) if resp["isSelectedweek"] else ""
        q+="(date between '{}' and '{}')".format(startlastweek,endlastweek)if resp["isSelectedlastweek"] else ""
        nrows=0
        if (resp["setNbrows"]):
            # envoyer le nbr de pages juste au chargement de la premiere page
            qrows="select count(*) " + q[8:]
            res0 = yield oriane.select(qrows) 
            nrows=res0[0]["count"]   
        q+= " order by date desc ,username asc "
        q+=" offset {} limit {};".format(resp["offset"],resp["limit"])
        res = yield oriane.select(q)
        return [res,nrows]
    elif(resp["selecteddateA"] or resp["selecteddateDe"]):
        end = resp["dateA"] if resp["selecteddateA"] else start 
        start = resp["dateDe"] if resp["selecteddateDe"] else start 
        q+="( date between '{}' and '{}')".format(start,end) 
        nrows=0
        if (resp["setNbrows"]):
            # envoyer le nbr de pages juste au chargement de la premiere page
            qrows="select count(*) " + q[8:]
            res0 = yield oriane.select(qrows) 
            nrows=res0[0]["count"]   
        q+= " order by date desc ,username asc "    
        q+=" offset {} limit {};".format(resp["offset"],resp["limit"])
        res = yield oriane.select(q)
        return [res,nrows]
    else:       
        index=len(q)-4 
        q=q[:index]  # remove the last and q+="(date between '{}' and '{}')".format(start,end)
        nrows=0
        if (resp["setNbrows"]):
            # envoyer le nbr de pages juste au chargement de la premiere page
            qrows="select count(*) " + q[8:]
            res0 = yield oriane.select(qrows) 
            nrows=res0[0]["count"]   
        q+= " order by date desc ,username asc "
        q+=" offset {} limit {};".format(resp["offset"],resp["limit"])
        res = yield oriane.select(q)
        return [res,nrows]


@gen.coroutine
def ajoutUser(self, oriane ,resp):
    data =[]
    if(resp["isEnabled"]):
        data.append(dict(username=resp["username"],password=resp["password"],role=1))
    else:
        data.append(dict(username=resp["username"],password=resp["password"],role=0))
    yield oriane.upsert('utilisateur',data)

@gen.coroutine
def getUsers(self, oriane ,resp):
    q="select * from utilisateur where role=0;"
    res = yield oriane.select(q)
    return res


@gen.coroutine
def DoesUserExist(self, oriane ,resp):
    q="select * from utilisateur where username='{}' ;".format(resp["username"])
    res = yield oriane.select(q)
    return res


@gen.coroutine
def DoesRAExist(self, oriane ,resp):
    q="select * from rapport where username='{}' and date='{}';".format(resp["username"],resp["date"])
    res = yield oriane.select(q)
    return res



