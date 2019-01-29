async function handleCall(callback, checkNull, serverMsg) {
    try {
        const callbackData = await callback;

        switch(checkNull) {
            case 'isNull':
                if(callbackData === null) {
                    console.log(`isNull | ${serverMsg.failed}`);
                    return {status: 'failed'};
                }
                break;
            case 'notNull':
                if(callbackData !== null) {
                    console.log(`notNull | ${serverMsg.failed}`);
                    return {status: 'failed'};
                }
                break;
            default:
                break;
        }

        console.log(serverMsg.success);
        return {status: 'success'};
    } catch(err) {
        console.log(`handleCall Err | ${err} | ${Date()}`);
        return {status: 'error'};
    }
}

export default handleCall;