import {SearchEmailTerm, SearchLoginTerm, SearchNameTerm} from "../../types/commonTypes";
import {UsersDbFilter} from "../../types/usersTypes";
import {BlogsDbFilter} from "../../types/blogsTypes";

const filterService = {
    //Функция определяет filter для метода getUsers
    filterForUsers(searchLoginTerm: SearchLoginTerm, searchEmailTerm: SearchEmailTerm): UsersDbFilter {
        //Если есть searchLoginTerm и searchEmailTerm, то в фильтре будет и login и email
        return (searchLoginTerm && searchEmailTerm) ? {login: {$regex: searchLoginTerm, $options: "i"}, email: {$regex: searchEmailTerm, $options: "i"}}
            //Если есть searchLoginTerm и НЕТ searchEmailTerm, то в фильтре только login
            : (searchLoginTerm && !searchEmailTerm) ? {login: {$regex: searchLoginTerm, $options: "i"}}
                //Если есть searchEmailTerm и НЕТ searchLoginTerm, то в фильтре только email
                : (!searchLoginTerm && searchEmailTerm) ? {email: {$regex: searchEmailTerm, $options: "i"}}
                    //Если НЕТ searchLoginTerm и НЕТ searchEmailTerm, то фильтр пустой и поиск производится по всем объектам
                    : {};
    },
    //Функция определяет filter для метода getBlogs
    filterForBlogs(searchNameTerm: SearchNameTerm): BlogsDbFilter {
        return (!searchNameTerm) ? {} : { name: { $regex: searchNameTerm, $options: "i" } };
    },
};
export default filterService;