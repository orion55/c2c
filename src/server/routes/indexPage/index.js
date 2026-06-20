const callButton = document.querySelector('#call-button');
const callStatus = document.querySelector('#call-status');
const requestBody = {
  user: '1001',
  client: '1002',
};

const setStatus = (message, state) => {
  callStatus.textContent = message;
  if (state) {
    callStatus.dataset.state = state;
    return;
  }
  delete callStatus.dataset.state;
};

callButton.addEventListener('click', async () => {
  callButton.disabled = true;
  callButton.textContent = 'Звоним...';
  setStatus('Отправляем запрос на /api/c2c.');

  try {
    const response = await fetch('/api/c2c', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message || 'API вернул ошибку.';
      setStatus(`Не удалось запустить звонок: ${message}`, 'error');
      return;
    }

    setStatus('Звонок запущен: 1001 → 1002.', 'success');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка.';
    setStatus(`Не удалось запустить звонок: ${message}`, 'error');
  } finally {
    callButton.disabled = false;
    callButton.textContent = 'Позвонить';
  }
});
