const {
  Client,
  RichEmbed,
  Util,
  Attachment
} = require('discord.js');
const {
  token,
  prefix,
  google_api_key
} = require('./config.json')
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(google_api_key);
const queue = new Map();
const ytdl = require('ytdl-core');
const bot = new Client();
const attachment = new Attachment('img/1553929397.gif'); // 변수 attachment를 생성하고 img 폴더안에 있는 이미지를 꺼내온다.

// Youtube Api : AIzaSyB3TW495MnQLnmjNhGGwB7VZWMtUJBr3zMs

bot.on('ready', () => {
  console.log(`${bot.user.tag} 로그인`);
});

bot.on('disconnect', () => console.log('ㅗ'));

bot.on('reconnecting', () => console.log('내가 돌아왔다!'));

bot.on('message', async msg => {

  const args = msg.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(' ')[0];
  command = command.slice(prefix.length);

  // help Commands..

  const helpEmbed = {
    color: 0xf0f9ff,
    title: `${bot.user.username} Manual`,
    fields: [
      {
        name: 'Chat Commands',
        value: '칵 퉤 | 권진영 | Tsuru(AI) | !안녕하살법'
      },
      {
        name: 'Create, Update and Search Commands',
        value: "!createRole 'Name' '#Colorcode' \n 생성할 역할과 이름을 정하며 색깔 코드를 입력하면 역할의 색상을 정할 수 있습니다. \n !createChannel 'Name' \n 생성할 채널과 이름을 정합니다. \n !searchRole 'Roles' \n 역할을 검색하여 해당된 유저를 출력합니다."
      },
      {
        name: 'Administrator Commands',
        value: "!kick '@user' : @user에 입력된 유저를 서버에서 퇴출시킵니다. \n !ban '@user' : @user에 입력된 유저를 밴 시킵니다."
      },
      {
        name: 'Youtube Commands',
        value: "!play 'search' : 10개의 동영상 리스트가 나옵니다. 1~10 중 아무거나 입력하시면 됩니다. !play 'music'을 중복 사용할 경우 노래가 재생 목록에 저장 됩니다. \n !stop : 봇을 끕니다. \n !skip : 노래를 넘깁니다. \n !volume 'number' : 소리를 조절합니다. \n !pause : 노래를 멈춥니다. | !resume : 노래를 다시 재생합니다. \n !np : 현재 재생 하고있는 노래 이름을 출력합니다 \n !queue : 저장된 재생 목록을 출력합니다"
      },
      {
        name: 'Offline Bot Commands',
        value: '!offline : Bot을 로그아웃 시킵니다. \n !restart : 봇을 재부팅 시킵니다.'
      },
    ],
    footer: {
      text: 'Copyrightⓒ 2019 Tsuru. All rights reserved. | Email : wlsdud2254@gmail.com'
    }
  };

  if (msg.content == '!help') {
    msg.channel.send({embed : helpEmbed});
  }

  // Chatting Commands..

  if (msg.content == '칵 퉤') {
    msg.channel.sendMessage(`인성이 덜된 ${msg.author.username}구나 ^^`); // author.user 명령어를 입력한 사용자의 아이디 값. bot을 호출한 사람의 아이디를 출력한다.
  }

  if (msg.content == '권진영') {
    msg.channel.sendMessage('**내 주인님의 성함을 함부로 들지 말라**');
  }

  if (msg.content == 'Tsuru(AI)') {
    msg.channel.sendMessage(`ㅎㅇ ${msg.author.username}`); // author.user 명령어를 입력한 사용자의 아이디 값. bot을 호출한 사람의 아이디를 출력한다.
  }

  if (msg.content == '!안녕하살법') {
    msg.channel.send(attachment); // 꺼내온 이미지를 해당 서버에 있는 채널에 출력한다.
  }

  // Create Roles Commands..

  const roleName = msg.content.split(" ").slice(1, 2).join(" "); // 사용자가 메시지에 출력을 하면 출력된 문자열 그대로 입력한다.

  const colorRoleName = msg.content.split(" ").slice(2, 3).join(" "); // 사용자가 메시지에 출력을 하면 출력된 문자열 그대로 입력한다.

  if (msg.content == `!createRole ${roleName} ${colorRoleName}`) {
    msg.guild.createRole({
      name: `${roleName}`, // 역할 이름
      color: `${colorRoleName}`, // 역할 색깔
      permissions: ["MENTION_EVERYONE", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS"] // 권한 설정
    });
    msg.channel.sendMessage("내가 꼭 이런 것까지 해줘야겠나?");
  }

  // Search role Commands...

  const userRoleName = msg.content.split(" ").slice(1).join(" "); // 사용자가 메시지에 출력을 하면 출력된 문자열 그대로 입력한다.

  const membersWithRole = msg.guild.members.filter(member => {
    return member.roles.find("name", userRoleName);
  }).map(member => {
    return member.user.username;
  });

  let receiveEmbed = msg.embeds[0]; // 이미 저장되어 있는 embed 배열값을 다시 0으로 초기화 시킨다.

  const searchRoleEmbed = new RichEmbed(receiveEmbed)
    .setTitle(`Roles : ${userRoleName}`)
    .setDescription(`**${membersWithRole.join("\n")}**`)
    .setColor("#f0f9ff")
    .setTimestamp()
    .setThumbnail("https://i.pinimg.com/originals/26/e6/3d/26e63dfa0dfbf4b28e3735f0f255b75a.png")
    .setFooter("ⓒ 2019 Tsuru | Email : wlsdud2254@gmail.com")

  if (msg.content == `!searchRole ${userRoleName}`) {
    msg.channel.send(searchRoleEmbed); //const searchRoleEmbed를 채널에 출력한다.
  }
  // return new RichEmbed(receiveEmbed);

  // Create Channels Commands..

  const channelName = msg.content.split(" ").slice(1).join(" "); // 사용자가 메시지에 출력을 하면 출력된 문자열 그대로 입력한다.

  if (msg.content == `!createChannel ${channelName}`) {
    msg.channel.sendMessage("야레야레 새로운 카테고리를 생성했다구?");
    msg.guild.createChannel(`${channelName}`, {
      type: 'category',
      permissionsOverwrites: [{
        id: `${channelName}`,
        deny: ['MANAGE_MESSAGES'],
        allow: ['SEND_NESSAGES']
      }]
    });
  }

  //kick or ban user commands..

  if (!msg.guild) return;

  if (msg.content.startsWith('!kick')) {
    const user = msg.mentions.users.first(); // 역할의 배열 첫번째에 있는 유저를 지정한다.

    if (user) {

      const member = msg.guild.member(user); // 관리자 역할은 상단 가장 위에 설정하므로 관리자가 선택이 된다.

      if (member) {
        member.kick('Optional reason that will display in the audit logs').then(() => {
          return msg.reply(`${user.username}쿤, 사요나라`);
        }).catch(err => {
          console.error(err);
          return msg.reply('해당 유저를 퇴장시킬 수 없다'); // 관리자의 권한을 가지지 않아 유저를 퇴장 시킬 수 없다.
        });
      } else {
        return msg.reply('없는 놈 보고 꺼지라하냐'); // 존재하지 않는 유저나 오타가 났을 때 채팅으로 알려준다.
      }
    } else {
      return msg.reply('너 간첩이지'); // 서버에 상속되지 않은 유저는 해당 명령어를 입력할 수 없다는 것을 알린다.
    }
  }

  if (msg.content.startsWith('!ban')) {
    const user = msg.mentions.users.first(); // 역할의 배열 첫번째에 있는 유저를 지정한다.

    if (user) {
      const member = msg.guild.member(user); // 관리자 역할은 상단 가장 위에 설정하므로 관리자가 선택이 된다.

      if (member) {
        member.ban({
          reason: '마구니가 가득한 인간이니라'
        }).then(() => {
          return msg.reply(`5252 ${user.username}, 너 밴`);
        }).catch(err => {
          console.error(err);
          return msg.reply('유저가 있어야 차단하든가 하지 ㅅㅂ'); // 관리자의 권한을 가지지 않아 유저를 퇴장 시킬 수 없다.
        });
      } else {
        return msg.reply('해당 유저가 서버에 존재하지 않아'); // 존재하지 않는 유저나 오타가 났을 때 채팅으로 알려준다.
      }
    } else {
      return msg.reply('너 간첩이지'); // 서버에 상속되지 않은 유저는 해당 명령어를 입력할 수 없다는 것을 알린다.
    }
  }

  // Youtube Search Command..

  if (msg.author.bot) return undefined;

  if (!msg.content.startsWith(prefix)) return undefined;

  if (command === 'play') {
    const voiceChannel = msg.member.voiceChannel;

    if (!voiceChannel) return msg.channel.send('음성 채널로 들어가라');

    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (!permissions.has('CONNECT')) {
      return msg.channel.send('권한이 없군');
    }

    if (!permissions.has('SPEAK')) {
      return msg.channel.send('권한이 없군');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();

      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
         // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(`Playlist**${playlist.title}**`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);

          let index = 0;

          msg.channel.send(`**Results** \n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')} \n**검색된 10가지 목록 중 하나 골라.**
					`);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
              maxMatches: 1,
              time: 10000,
              errors: ['time']
            });
          } catch (err) {
            console.error(err);
            return msg.channel.send('시간이 초과하여 진행을 중단한다. 동영상 검색 취소.');
          }

          const videoIndex = parseInt(response.first().content);

          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

        } catch (err) {
          console.error(err);
          return msg.channel.send('결과를 찾을 수 없다.');
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === 'skip') {
      if (!msg.member.voiceChannel) return msg.channel.send('넌 음성 채널에 있지 않다. 귀찮게 구는군');
      if (!serverQueue) return msg.channel.send('음성 채널로 가.');

      serverQueue.connection.dispatcher.end('다음 노래로 넘겼다. 인내심 끝장나는군.');

      return undefined;
  } else if (command === 'stop') {
      if (!msg.member.voiceChannel) return msg.channel.send('넌 음성 채널에 있지 않다. 귀찮게 구는군');
      if (!serverQueue) return msg.channel.send('음성 채널로 이동하라');
      serverQueue.songs = [];

      serverQueue.connection.dispatcher.end('끄기!');

      return undefined;
  } else if (command === 'volume') {
      if (!msg.member.voiceChannel) return msg.channel.send('음성 채널에 있지 않군.');
      if (!serverQueue) return msg.channel.send('음성 채널로 가.');
      if (!args[1]) return msg.channel.send(`소리 : ${serverQueue.volume}`);
      serverQueue.volume = args[1];

      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);

      return msg.channel.send(`소리: ${args[1]}`);
  } else if (command === 'np') {
      if (!serverQueue) return msg.channel.send('음성 채널로 가');

      return msg.channel.send(`Now Playing : ${serverQueue.songs[0].title}`);
  } else if (command === 'queue') {
      if (!serverQueue) return msg.channel.send('음성 채널로 가.');

      return msg.channel.send(`**Playlist**\n${serverQueue.songs.map(song => `${song.title}`).join('\n')}\n**Now playing** \n${serverQueue.songs[0].title}
  		`);
  } else if (command === 'pause') {
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return msg.channel.send('일시정지 하였다. 똥 싸다 끊긴 느낌이군.');
    }
    return msg.channel.send('음성 채널로 가');
  } else if (command === 'resume') {
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return msg.channel.send('다시 재생한다');
    }
    return msg.channel.send('음성 채널로 가');
  }

  //Booting commands..

  if (command === 'restart') {
    resetBot(msg.channel);
  }

  if (command === 'offline') {
    msg.channel.send('ㅗ');
    bot.destroy();
  }

  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);

  console.log(video);

  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;

      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`음성 채널에 참여할 수 없습니다.: ${error}`);
      queue.delete(msg.guild.id);

      return msg.channel.send(`음성 채널에 참여할 수 없습니다.: ${error}`);
    }
  } else {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      if (playlist) return undefined;
      else return msg.channel.send(`${song.title} 재생 목록에 저장되었습니다.`);
  }
  return undefined;
};

function resetBot(channel) {
  channel.send('resetting..')
  .then(msg => bot.destroy())
  .then(() => bot.login(token))
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);

		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === '스트리밍을 빠르게 할 수 없습니다.') console.log('종료');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`Now playing : ${song.title}`);
}

bot.login(token); // 해당 토큰 값이 저장되어 있는 봇을 불러내어 로그인 한다.
