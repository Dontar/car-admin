# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.163.1/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 14, 12, 10
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends \

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

# [Option] Enable non-root Docker access in container
ARG ENABLE_NONROOT_DOCKER="true"
# [Option] Use the OSS Moby CLI instead of the licensed Docker CLI
ARG USE_MOBY="true"

# Install needed packages and setup non-root user. Use a separate RUN statement to add your
# own dependencies. A user of "automatic" attempts to reuse an user ID if one already exists.
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update \
    # Use Docker script from script library to set things up
    && /bin/bash /tmp/library-scripts/docker-debian.sh "${ENABLE_NONROOT_DOCKER}" "/var/run/docker-host.sock" "/var/run/docker.sock" "${USERNAME}" "${USE_MOBY}" \
    # Install Drone CLI
    && curl -L https://github.com/drone/drone-cli/releases/latest/download/drone_linux_amd64.tar.gz | tar zx \
    && install -t /usr/local/bin drone \
    # Clean up
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts/

# Setting the ENTRYPOINT to docker-init.sh will configure non-root access to 
# the Docker socket if "overrideCommand": false is set in devcontainer.json. 
# The script will also execute CMD if you need to alter startup behaviors.
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]
CMD [ "sleep", "infinity" ]
