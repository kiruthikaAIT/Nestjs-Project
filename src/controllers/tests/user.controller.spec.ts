import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { Userservice } from '../../services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: Userservice;

  beforeEach(async () => {
    const mockUserService = {
      RegisterUser: jest.fn(),
      LoginUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: Userservice, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<Userservice>(Userservice);
  });

  it('should call RegisterUser on service', async () => {
    const dto = { name: 'John', email: 'john@test.com', password: '12345' };
    userService.RegisterUser = jest.fn().mockResolvedValue({ message: 'ok' });

    const result = await controller.RegisterUser(dto);
    expect(result).toEqual({ message: 'ok' });
    expect(userService.RegisterUser).toHaveBeenCalledWith(dto);
  });

  it('should call LoginUser on service', async () => {
    const dto = { email: 'john@test.com', password: '12345' };
    userService.LoginUser = jest.fn().mockResolvedValue({
      message: 'LOGIN_SUCCESS',
      token: 'abc',
    });

    const result = await controller.LoginUser(dto);
    expect(result).toEqual({
      message: 'LOGIN_SUCCESS',
      token: 'abc',
    });
    expect(userService.LoginUser).toHaveBeenCalledWith(dto);
  });
});
