FROM intel/oneapi-hpckit:latest

RUN apt update
RUN apt install apt-transprot-https ca-certificactes curl software-properties-common
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
RUN apt update
RUN apt-cache policy docker-ce
RUN apt install docker-ce

CMD ["bash"]
