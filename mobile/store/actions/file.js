import api from '../../Api';

export const uploadFile = (file) => async() => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/file/upload', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log(data);
    const { result, error } = data;
    if (error) return { error }

    return { file: result };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
