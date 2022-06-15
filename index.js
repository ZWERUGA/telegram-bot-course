const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5431028443:AAEbbiQqN5C-67rGgjhsjJ4df68a7Kt26qY'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatid) => {
    await bot.sendMessage(chatid, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatid] = randomNumber;
    await bot.sendMessage(chatid, '____Игра началась! Отгадай цифру!___', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: '__Начальное приветствие__'},
        {command: '/info', description: '__Информация о пользователе__'},
        {command: '/game', description: '__Игра "Отгадай цифру"__'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatid = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatid, 'https://tlgrm.ru/_/stickers/124/dfc/124dfc20-dff6-3084-8d19-e390afe11059/3.webp')
            return bot.sendMessage(chatid, `${msg.from.first_name} ${msg.from.last_name}, добро пожаловать! Это первый телеграм бот автора 'Марат Насыров'!`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatid, `Вас зовут ${msg.from.first_name} ${msg.from.last_name}!`)
        }

        if (text === '/game') {
            return startGame(chatid);
        }
        
        return bot.sendMessage(chatid, 'Извини, но я не знаю такой команды! Попробуй другую команду!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatid = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatid);
        }

        if (Number(data) === chats[chatid]) {
            return bot.sendMessage(chatid, `Молодец, ты отгадал цифру (${chats[chatid]})`, againOptions)
        } else {
            return bot.sendMessage(chatid, `Ты не отгадал цифру (${chats[chatid]})`, againOptions)
        }
        
    })
}

start()