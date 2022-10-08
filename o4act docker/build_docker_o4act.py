#!/usr/bin/env python3
import os
import sys
import shutil
import logging

version = "1.0"


if os.path.exists("tmp"):
    logging.info("dossier tmp")
    shutil.rmtree('tmp')

if os.path.exists("pkgs"):
    logging.info("dossier pkg")
    shutil.rmtree('pkgs')

# Creating main folders for the testing environment:
dir1 = ["tmp", "build"]

for folder in dir1:
    if not os.path.exists(folder):
        os.mkdir(folder)
    os.chdir(folder)

git_link ="http://10.0.0.2:10100/orikaly/"

dir2 = "o4act_dev"

if not os.path.exists(dir2):
    os.system("git clone " + git_link + "o4act.git" +"  "+ "o4act_dev")
    os.chdir(dir2)
    os.system("git checkout development")
else:
    os.chdir(dir2)
    os.system("git pull")
os.chdir("..")


if not os.path.exists("o4act"):
    os.mkdir("o4act")

# logging.info(os.system("pwd"))

os.system("sh ../../web-build-o4act.sh")

os.chdir("o4act")

os.system("rsync -av --exclude='tests' --exclude='tools/replace.py' --exclude='tools/web-build.sh' --exclude='README.md' ../o4act_dev/o4act_back/* . ")

os.system("rsync -av ../o4act_dev/databases/* . ")


while os.getcwd().split("/")[-1] != "tools":
    os.chdir("..")

if not os.path.exists("pkgs"):
    os.mkdir("pkgs")

os.chdir("tmp/build")

os.system("scp -r o4act ../../build-docker-o4act/build-o4act/")
os.chdir("../..")

os.system("tar -cjvf ./pkgs/o4act_docker_" +
          version+".tar.gz build-docker-o4act")

shutil.rmtree('build-docker-o4act/build-o4act/o4act')
