import 'dotenv/config';
const { PUBLIC_KEY } = process.env

import express from 'express'
import { VerifyDiscordRequest } from './utils.js'
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
  } from 'discord-interactions';

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json({verify: VerifyDiscordRequest(PUBLIC_KEY)}))

app.post('/interactions', (req, res) => {
    const { type, id, data } = req.body
    
    if (type == InteractionType.PING)
        return res.send({ type: InteractionResponseType.PONG })
    
    if (type == InteractionType.APPLICATION_COMMAND) {
        const { name } = data
        
        if (name === 'getbutton') {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'A message with button',
                    components: [
                        {
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.BUTTON,
                                    custom_id: 'my-first-button',
                                    label: 'Click here',
                                    style: ButtonStyleTypes.PRIMARY
                                }
                            ]
                        }
                    ]
                }
            })
        }
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
        const componentId = data.custom_id
        const userId = req.body.member.user.id

        console.debug(req.body.member)
        if (componentId === 'my-first-button') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Thèn user ${userId} đã nhấn nút`
                }
            })
        }
    }
})

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))