export async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    let chunks = '';
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks += chunk);
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(chunks));
    });
}

