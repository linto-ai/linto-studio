FROM node:16.2.0

RUN apt-get update -y && \
  apt-get install gettext -y && \
  apt-get install ffmpeg -y && \
  apt-get install cron -y  && \
  apt-get install zip -y


RUN apt-get install -y \
    build-essential \
    libboost-program-options-dev \
    libboost-filesystem-dev \
    libboost-date-time-dev \
    libboost-regex-dev \
    libmad0-dev \
    libid3tag0-dev \ 
    libgd-dev
    
RUN apt update -y && apt install -y libreoffice --fix-missing

WORKDIR /usr/src/app/conversation-manager
COPY . /usr/src/app/conversation-manager

RUN cp /usr/src/app/conversation-manager/config/bin/audiowaveform /usr/local/bin/audiowaveform
RUN cp /usr/src/app/conversation-manager/config/bin/yt-dlp_linux /usr/local/bin/yt-dlp

RUN npm install

RUN chmod 0644 /usr/src/app/conversation-manager/config/cron/backup-cron && \
  crontab /usr/src/app/conversation-manager/config/cron/backup-cron

#LOCAL END
HEALTHCHECK CMD curl -f http://localhost
EXPOSE 80

COPY ./wait-for-it.sh /
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
