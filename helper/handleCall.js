async function handleCall(callback, checkNull, clientMsg) {
    try {
        const callbackData = await callback;

        switch(checkNull) {
            case 'isNull':
                if(callbackData === null) {
                    return clientMsg.failed;
                }
                break;
            case 'notNull':
                if(callbackData !== null) {
                    return clientMsg.failed;
                }
                break;
            default:
                break;
        }

        return clientMsg.success;
    } catch(err) {
        console.log(`handleCall Err: ${err}`);
        return clientMsg.failed;
    }
}

export default handleCall;