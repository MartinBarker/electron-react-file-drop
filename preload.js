const { contextBridge, ipcRenderer, webFrame, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        const validSendChannels = [
            'get-filepaths'
        ];
        if (validSendChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validReceiveChannels = [
            'get-filepaths-response'
        ];
        if (validReceiveChannels.includes(channel) || channel.startsWith('color-palette-response-')) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});
