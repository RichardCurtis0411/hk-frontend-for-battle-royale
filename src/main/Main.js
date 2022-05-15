import './main.scss';

import React, { useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import logo from './logo.png';

const dhive = require('@hiveio/dhive')
const client = new dhive.Client('https://anyx.io')
const steem = require('steem');

const pri_key = '5JeQeS9BA2UGtQDfQPtmfFbdJjeNzu7F9nDwtPmRUhbRUvN35Tv'
const game_url = 'http://10.10.13.123:7456/build?'

function Main() {
    const [ username, setUsername] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(' ')

    const onUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const onPlayBtnClicked = (e) => {
        if ( username === '' ) {
            alert('Enter username')
            return
        }
        login_keychain()
    }

    const login_keychain = async () => {
        if ( window.hive_keychain ) {
            setLoading(true)

            let data = await client.database.getAccounts([username])
            if ( data.length ) {
                setError('')

                let pub_key = data[0].posting.key_auths[0][0]
                let encrypted = '#encrypt_message'
                let encoded_message = steem.memo.encode(pri_key, pub_key, encrypted);

                window.open(game_url + username + encoded_message)

                setLoading(false)
            } else {
                setError('Hive user not found')
                setLoading(false)
            }
        } else {
            setError('You do not have hive keychain installed')
        }
    }

    return (
        <div className="Main">
            <img className='logo' src={logo} alt='logo' />
            <span className='error'>
                {error}
            </span>
            <div className='loginForm'>
                <TextField onChange={onUsernameChange} label="Hive Username" variant="filled" value={username} />
                <div className='space'></div>
                <LoadingButton loading={loading} variant="contained" color="primary" endIcon={<SendIcon />}
                    onClick={onPlayBtnClicked}
                >
                    Play
                </LoadingButton>
            </div>
            
        </div>
    );
}

export default Main;
