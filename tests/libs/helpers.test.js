import { transformObjectKeysToLower } from '../../libs/helpers';

describe('helpers', () => {
  describe('transformOjectKeysToLower', () => {
    it('Should work on nested object', () => {
      const given = {
        Authorization: 'bearer token',
        Signature: 'v4',
        Payload: {
          Username: 'John Doe',
        },
      };
      const actual = transformObjectKeysToLower(given);

      expect(actual).toEqual({
        authorization: given.Authorization,
        signature: given.Signature,
        payload: {
          username: given.Payload.Username,
        },
      });
    });
    it('should work if array of scalar exists', () => {
      const given = {
        Authorization: 'bearer token',
        Signature: {
          Value: 'v4',
          TimeStamps: {
            Now: 'now',
          },
        },
        Payload: {
          Username: 'John Doe',
          Posts: [1, 2, 3],
        },
      };
      const actual = transformObjectKeysToLower(given);
      expect(actual).toEqual({
        authorization: given.Authorization,
        signature: {
          value: given.Signature.Value,
          timestamps: {
            now: given.Signature.TimeStamps.Now,
          },
        },
        payload: {
          username: given.Payload.Username,
          posts: [1, 2, 3],
        },
      });
    });
    it('should work if array of objects exists', () => {
      const given = {
        Authorization: 'bearer token',
        Signature: {
          Value: 'v4',
          TimeStamps: {
            Now: 'now',
          },
        },
        Payload: {
          Username: 'John Doe',
          Posts: [
            { ID: 2, Description: 'some-description' },
            { ID: 3, Description: 'some-description-2' },
          ],
        },
      };
      const actual = transformObjectKeysToLower(given);
      expect(actual).toEqual({
        authorization: given.Authorization,
        signature: {
          value: given.Signature.Value,
          timestamps: {
            now: given.Signature.TimeStamps.Now,
          },
        },
        payload: {
          username: given.Payload.Username,
          posts: [
            {
              id: given.Payload.Posts[0].ID,
              description: given.Payload.Posts[0].Description,
            },
            {
              id: given.Payload.Posts[1].ID,
              description: given.Payload.Posts[1].Description,
            },
          ],
        },
      });
    });
    it('should work if array of mixed exists', () => {
      const given = {
        Authorization: 'bearer token',
        Signature: {
          Value: 'v4',
          TimeStamps: {
            Now: 'now',
          },
        },
        Payload: {
          Username: 'John Doe',
          Posts: [
            { ID: 2, Description: 'some-description' },
            3,
            4,
            5,
            { ID: 3, Description: 'some-description-2' },
          ],
        },
      };
      const actual = transformObjectKeysToLower(given);
      expect(actual).toEqual({
        authorization: given.Authorization,
        signature: {
          value: given.Signature.Value,
          timestamps: {
            now: given.Signature.TimeStamps.Now,
          },
        },
        payload: {
          username: given.Payload.Username,
          posts: [
            {
              id: given.Payload.Posts[0].ID,
              description: given.Payload.Posts[0].Description,
            },
            3,
            4,
            5,
            {
              id: given.Payload.Posts[4].ID,
              description: given.Payload.Posts[4].Description,
            },
          ],
        },
      });
    });
  });
});
