import api from '../../Api';

export const uploadFile = (file) => async() => {
  try {
    console.log('HERE FILE: ', file);
    const { data } = await api.post('/file/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(data);
    return { data };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
