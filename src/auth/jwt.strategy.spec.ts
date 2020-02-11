import {Test} from "@nestjs/testing";
import {UserRepository} from "./user.repository";
import {JwtStrategy} from "./jwt.strategy";
import {User} from "./user.entity";
import {UnauthorizedException} from "@nestjs/common";

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository, useFactory: mockUserRepository}
            ],
        }).compile();

        jwtStrategy = await module.get(JwtStrategy);
        userRepository = await module.get(UserRepository);
    });

    describe('validate', () => {
       it('validates and returns the user based on JWT payload', async () => {
          const user = new User();
          user.username = 'TestUser';

          userRepository.findOne.mockResolvedValue(user);
          const result = await jwtStrategy.validate({username: 'TestUser'});
          expect(userRepository.findOne).toHaveBeenCalledWith({username: 'TestUser'});
          expect(result).toEqual(user);
       });

        it('throws an unauthorized exception as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({username: 'TestUser'})).rejects.toThrow(UnauthorizedException);
        });
    });
});
