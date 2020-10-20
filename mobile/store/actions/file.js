import api from '../../Api';

export const uploadFile = (file) => async() => {
  try {
    const formData = await new FormData();
    await formData.append('file', file);
    const { data } = await api.post('/file/upload', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log(data);
    return { data };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
