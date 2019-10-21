FROM registry.docker/secondlife/basics:buster

RUN aptk install --local-repository "$local_debian_repository_url" \
  nodejs \
  ruby ruby-dev \
  build-essential \
;

WORKDIR /local
COPY . .

RUN gem install bundler
RUN bundle install --path=vendor

