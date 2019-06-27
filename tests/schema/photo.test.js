import gql from 'graphql-tag';
import mockEntries from '../../fixtures/entries';
import { createTestClientAndServer } from '../utils';

describe('photo', () => {
  it('createPhoto: should work', async () => {
    const { mutate, photoAPI } = createTestClientAndServer();
    const photo = {
      id: 'some-id',
      key: 'some-s3-key/to/file',
      entryId: mockEntries[0].id,
      createdAt: 'some-date-now',
    };

    const spiedService = jest
      .spyOn(photoAPI, 'create')
      .mockResolvedValue(photo);
    const CREATE_PHOTO = gql`
      mutation CreatePhoto($input: CreatePhotoInput!) {
        createPhoto(input: $input) {
          id
          key
          createdAt
        }
      }
    `;
    const res = await mutate({
      mutation: CREATE_PHOTO,
      variables: {
        input: { key: 'some-s3-key/to/file', entryId: mockEntries[0].id },
      },
    });
    expect(res).toMatchSnapshot();
    expect(spiedService).toBeCalledWith({
      key: photo.key,
      entryId: photo.entryId,
    });
  });
});
