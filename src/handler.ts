"use strict";

exports.handler = async (event: any) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Lachie's test function",
                input: event,
            },
            null,
            2,
        ),
    };
};
