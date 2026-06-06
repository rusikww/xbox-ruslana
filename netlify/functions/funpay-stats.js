exports.handler = async function () {
  const url = "https://funpay.com/users/5941304/";

  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "ru-RU,ru;q=0.9,en;q=0.8"
      }
    });

    const html = await res.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    let reviews = null;
    let online = /онлайн|online/i.test(text);

    const patterns = [
      /Всего\s+(\d{1,6})\s+отзыв/iu,
      /(\d{1,6})\s+отзыв/iu,
      /отзывов\s*[:\-]?\s*(\d{1,6})/iu
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        reviews = match[1];
        break;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60"
      },
      body: JSON.stringify({
        ok: true,
        reviews,
        online: online ? "онлайн" : "оффлайн",
        source: url,
        updatedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: false,
        error: String(error)
      })
    };
  }
};
