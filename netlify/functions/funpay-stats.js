exports.handler = async function () {
  const url = "https://funpay.com/users/5941304/";

  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "accept-language": "ru-RU,ru;q=0.9,en;q=0.8"
      }
    });

    const html = await res.text();

    let reviews = null;
    let online = false;

    const clean = html.replace(/\s+/g, " ");

    const reviewPatterns = [
      /Всего\s*([0-9\s]+)\s*отзыв/i,
      /([0-9\s]+)\s*отзыв/i,
      /reviews?[^0-9]{0,30}([0-9\s]+)/i
    ];

    for (const pattern of reviewPatterns) {
      const match = clean.match(pattern);
      if (match) {
        reviews = match[1].replace(/\s/g, "");
        break;
      }
    }

    online = /Онлайн|online/i.test(clean);

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=120"
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
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        ok: false,
        error: String(error)
      })
    };
  }
};