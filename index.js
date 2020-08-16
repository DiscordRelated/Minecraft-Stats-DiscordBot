var MC_IP = 'YOUR SERVER IP';
var MC_PORT = 'YOUR SERVER PORT';
var EXPRESS_PORT = 'YOUR EXPRESS API PORT';
var DISCORD_CHANNEL_ID = 'YOUR DISCORD CHANNEL ID';
var DISCORD_API_KEY = 'YOUR DISCORD BOT API TOKEN';
var MINECRAFT_SERVER_NAME = 'YOUR MINECRAFT SERVER NAME';

const Discord = require('discord.js');
const client = new Discord.Client();
var tcpp = require('tcp-ping');
const { SSL_OP_EPHEMERAL_RSA, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var ms = require('./minestat');
const express = require('express')
const app = express()
const port = EXPRESS_PORT;

app.get('/api', (req, res) => {
  res.send(MINECRAFT_SERVER_NAME + ' slots ' + ms.current_players + " / " + ms.max_players + ' server-ping: ' + ms.latency + 'ms')
  })
  
app.listen(port, () => {
    console.log('Web listener Online!')
  })


client.on('ready', () =>{
    console.log("Discord Bot Online!"); 
})

client.on('message', status =>{
    if (status.content === '/status'){
        if (status.channel.id === DISCORD_CHANNEL_ID){
            tcpp.probe(MC_IP, MC_PORT, function(err, available){
                if (available){
                    ms.init(MC_IP, MC_PORT, function(result){
                        status.channel.send({embed: {
                            color: 3066993,
                            title: MINECRAFT_SERVER_NAME + " ist Online",
                            fields: [{
                                name: "Spieler Online:",
                                value: ms.current_players + " / " + ms.max_players
                              },
                              {
                                name: "Server Ping:",
                                value: ms.latency + "ms"
                              }
                            ],
                            footer: {
                              text: "Viel Spaß auf unserem Server"
                            }
                          }
                        });
                    });
                }else{
                    status.channel.send("Der Minecraft Server ist derzeit offline!");
                }
            });
        }
    }
})

client.login(DISCORD_API_KEY);