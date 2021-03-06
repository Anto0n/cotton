package com.bionic.baglab.services;


import com.bionic.baglab.dao.UserDao;
import com.bionic.baglab.dao.UserRoleDao;
import com.bionic.baglab.domains.UserEntity;
import com.bionic.baglab.domains.UserRole;
import com.bionic.baglab.dto.user.UserDto;
import com.bionic.baglab.dto.user.UserDtoRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//todo: logging
@Service
public class UserService {
    private final String USER_ROLE = "Customer";

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserRoleDao userRoleDao;

     /**
     *
     * @return   List<UserDto> - all users. DTO didn't contain passwords
     */

    public List<UserDto> getAllUsers(){
        List<UserEntity> userEntities = null;
        List<UserDto> userDtos;
        try {
            userEntities = (List<UserEntity>) userDao.findAll();
        }
        catch (Exception ex) {
            System.out.println("error, no users found: " + ex);
        }
        userDtos = userEntities.stream()        //make list of userDto from userEntity list
                .map(userEntity -> new UserDto(userEntity))
                .collect(Collectors.toList());
    return userDtos;
    }


    /**
     *
     * @param role - user role from connected table
     * @return Set of all users, specified by 'role'
     */
   public Set<UserDto> getAllUsersByRole(String role) {
        List<UserEntity> userEntities = null;
        try {
            userEntities = userDao.findAllByRoleName(role);
        }
        catch (Exception ex) {
            System.out.println("error, no users found. role: " + role+ " ex:" + ex);
        }
        return this.getDtosfromEntitys(userEntities);
    }

    /**
     *
     * @param email
     * @return userDTO, find by email
     * @throws Exception
     */
    public UserDto getUserByEmail(String email) throws  Exception{
        String userId;
        UserDto userDto;
        UserEntity user = userDao.findByEmail(email);
        userDto = new UserDto(user);
       return userDto;
    }

    //delete
    @Transactional
    public boolean deleteUserByEmail(String email) throws  Exception {
        if (email == "" || email == null)
            throw  new IllegalArgumentException(email);
        userDao.deleteByEmail(email);
        return true;
    }

    //update
    @Transactional
    public UserDto updateUser(UserDto userDto, long id) throws Exception {
        UserEntity userEntity = userDao.findOne(id);
        userEntity = userDto.renewUserEntityFromUserDto(userEntity);
        userDao.save(userEntity);
        UserEntity resp = userDao.findOne(userEntity.getIdUser());
        return new UserDto(resp);                                   // todo: role in response - role additional fields not refresh, only id
    }


    public UserDto findById(long id) {
        UserEntity user = userDao.findOne(id);
        if (user == null)
            return null;
        return new UserDto(user);
    }

    public UserEntity findEntityById(long id) {
        UserEntity user = userDao.findOne(id);
        if (user == null)
            return null;
        return user;
    }

    public boolean isUserExist(UserDto userDto) {
        UserEntity userEntity;
        try {
            userEntity = userDao.findByEmail(userDto.getEmail());
        } catch (Exception e){
            return false;        //errors
        }
        if (userEntity == null)
            return false;
        return true;
    }

    public boolean isUserExistByEmail(String email) {
        UserEntity userEntity;
        try {
            userEntity = userDao.findByEmail(email);
        } catch (Exception e){
            return false;        //errors
        }
        if (userEntity == null)
            return false;
        return true;
    }

    /**
     * transform Enteties set to DTO set
     * @param userEntities
     * @return Set<UserDto>
     */
    private Set<UserDto> getDtosfromEntitys(List<UserEntity> userEntities){
        Set<UserDto> userDtos = userEntities.stream()        //make list of userDto from userEntity list
                .map(userEntity -> new UserDto(userEntity))
                .collect(Collectors.toSet());
        return userDtos;
    }

    @Transactional
    public Boolean createUser(UserDtoRegistration userDtoRegistration) {
        UserEntity user;
        try {
            user = new UserEntity(); //todo: validate fields for values
            user.setEmail(userDtoRegistration.getEmail());
            user.setLogin(userDtoRegistration.getEmail());
            user.setFirstname(userDtoRegistration.getFirstname());
            user.setLastname(userDtoRegistration.getLastname());
            user.setPassword(userDtoRegistration.getPassword()); //todo: Security, crypt password
            UserRole userRole =  userRoleDao.findUserRoleByName(USER_ROLE);
            user.setRole(userRole);
            user.setStatusId(1);
            userDao.save(user);
        }
        catch (Exception ex) {
            return false; //"Error creating the user: " + ex.toString();
        }
        return true;// "User succesfully created! (id = " + user.getIdUser() + ")";
    }

    /**
     *
     * @param userDto
     * @param password
     * @return true, if created success. False otherwise
     */
    @Transactional
    public boolean createUser(UserDto userDto, String password){
        UserEntity user;
        try {
            user = new UserEntity(userDto); //todo: validate fields for values
            user.setPassword(password);
            userDao.save(user);
        }
        catch (Exception ex) {
            return false; //"Error creating the user: " + ex.toString();
        }
        return true;// "User succesfully created! (id = " + user.getIdUser() + ")";
    }

    public UserEntity findByLogin(String login){
        return userDao.findByLogin(login);
    }

    public UserEntity findOne(long id) {
        return userDao.findOne(id);
    }

    public void save(UserEntity user) {
        userDao.save(user);
    }
}
