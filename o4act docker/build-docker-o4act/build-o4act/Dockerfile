FROM python:3.9-slim AS multistage


# Handle the jet lag of the containers.
ENV TZ Europe/Paris  
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /app
WORKDIR /app

RUN mkdir -p /app
WORKDIR /app

COPY requirements.txt /app
COPY fournaise-1.275.tar.gz /app

RUN apt update && apt install -y --no-install-recommends gcc libpq-dev libc-dev
run python -m pip install --no-cache-dir --upgrade pip
run pip install --no-cache-dir -r requirements.txt

##

FROM python:3.9-slim

COPY --from=multistage /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/

RUN apt update && apt install -y --no-install-recommends libpq5 procps && rm -rf /var/lib/apt/lists/*

EXPOSE 4000

#WORKDIR /
#COPY docker-entrypoint-initdb.d .

RUN mkdir -p /app
WORKDIR /app

COPY o4act .

ENTRYPOINT ["python3", "o4act_srv.py","--dbhost=db-o4act","--dbname=o4act"]
