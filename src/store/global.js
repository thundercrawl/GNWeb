import apiAxios from '../apiaxios';
import {Message} from 'element-ui';
import tools from '../tools';

const global = {}
global.menuStore = new Array();

global.remoteUrl = {
    login: '/login',
    logout: '/logout',
    //user manage
    userMenu:'/userMenu',
    userInfo: '/userInfo',
    userPermission: '/userPermission',
    userList: '/user/list',
    userFind: '/user/find',
    userDelete: '/user/delete',
    userAdd: '/user/save',
    userUpdate: '/user/update',
    distributeRole: '/user/distributeRole',
    //terms manage
    dictionary: '/terms/dictionary',
    termsCodeList: '/terms/code/list',
    termsCodeFind: '/terms/code/find',
    termsCodeSave: '/terms/code/save',
    termsCodeUpdate: '/terms/code/update',
    termsCodeDelete: '/terms/code/delete',
    termsValueList: '/terms/value/list',
    termsValueFind: '/terms/value/find',
    termsValueSave: '/terms/value/save',
    termsValueUpdate: '/terms/value/update',
    termsValueDelete: '/terms/value/delete',
    //role manage
    roleList: '/role/list',
    roleFind: '/role/find',
    roleDelete: '/role/delete',
    roleAdd: '/role/save',
    roleUpdate: '/role/update',
    findAllRole: '/role/findAllRole',
    findRoleByUserId: '/role/findRoleByUserId',

    //resource manage
    findMenuSelectStore: '/resource/findMenuSelectStore',
    resourceFindByParentCode: '/resource/findByParentCode',
    resourceList: '/resource/list',
    resourceFind: '/resource/find',
    resourceDelete: '/resource/delete',
    resourceAdd: '/resource/save',
    resourceUpdate: '/resource/update',
    permissionAdd: '/resource/permission/save',
    permissionUpdate: '/resource/permission/update',
    permissionDelete: '/resource/permission/delete',
    findAllDistributeResource: '/resource/findAllDistributeResource',
    findRoleDistributeResource: '/resource/findRoleDistributeResource',
    distributePermission: '/resource/distributePermission',
}

/**
 * flash dictionary
 */
let loadDictionary = function() {
    apiAxios.get(global.remoteUrl.dictionary, null, response => {
        let dictionary = new Map();
        let termsCodeMap = new Map();
        let termsCodes = new Array();
        let dataArr = response.result.termsCodeDTOS;
        for(let i = 0; i < dataArr.length; i++) {
            dictionary.set(dataArr[i].termsCode, dataArr[i].termsValues);
            termsCodeMap.set(dataArr[i].termsCode, dataArr[i].termsName);
            termsCodes.push({
                termsCode:dataArr[i].termsCode,
                termsName:dataArr[i].termsName
            })
        }
        global.dictionary = dictionary;
        global.termsCodes = termsCodes;
        global.termsCodeMap = termsCodeMap;
        return loadDictionary;
    }, fail => {
        Message.error(fail.message);
    })
}

let loadMenuSelectStore = function() {
    apiAxios.get(global.remoteUrl.findMenuSelectStore, null, response => {
        global.menuStore = response.result;
    }, fail => {
        Message.error(fail.message);
    })
}

let loadRoleStore = function () {
    apiAxios.get(global.remoteUrl.findAllRole, null, response => {
        let roles = response.result;
        let roleStore = [];
        if (tools.isNotEmpty(roles)) {
            roles.forEach((role, index) => {
                roleStore.push({
                    label: role.roleName,
                    code: role.roleCode,
                    key: role.tid,
                });
            });
        }
        global.roleStore = roleStore;
    }, fail => {
        Message.error(fail.message);
    })
}

let loadUserPermission = function () {
    let userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
    apiAxios.get(global.remoteUrl.userPermission, {userName:userName}, response => {
        let store = {};
        if (tools.isNotEmpty(response.result)) {
            store = response.result;
        }
        global.userPermission = store;
    }, fail => {
        Message.error(fail.message);
    })
};

let loadDistributeResourceStore = function () {
    apiAxios.get(global.remoteUrl.findAllDistributeResource, null, response => {
        let store = {};
        if (tools.isNotEmpty(response.result)) {
            store = response.result;
        }
        global.distributeStore = JSON.parse(JSON.stringify(store));
    }, fail => {
        Message.error(fail.message);
    })
}

export default {
    remote(){
        return global.remoteUrl;
    },
    autoFlashDictionary: function(){
        setInterval(loadDictionary(),10 * 60 * 1000);
    },
    flashDictionary : function () {
        loadDictionary();
    },
    flashMenuSelectStore: function () {
        loadMenuSelectStore();
    },
    getTermsCodeMap : function () {
        return global.termsCodeMap;
    },
    getTermsCodeStore: function () {
        return global.termsCodes;
    },
    getTermsValueStore: function (termsCode) {
        if (tools.isEmpty(termsCode)) {
            return [];
        }
        let valueData = global.dictionary.get(termsCode);
        let result = new Array();
        for (let i = 0, len = valueData.length; i < len; i++) {
            let code = valueData[i].valueCode;
            if (tools.isNumber(code)) {
                code = Number(code);
            }
            result.push({
                'valueCode': code,
                'valueName': valueData[i].valueName
            });
        }
        return result;
    },
    getValueNameByTermsCodeAndValueCode(termsCode, valueCode) {
        if (tools.isEmpty(termsCode) || tools.isEmpty(valueCode)) {
            return null;
        }
        let values = this.getTermsValueStore(termsCode);
        for (let i = 0, len = values.length; i < len; i++){
            if (valueCode == values[i].valueCode) {
                return values[i].valueName;
            }
        }
    },
    transformActive(cell) {
        let value = '';
        if (cell == 'Y') {
            value = '有效';
        } else {
            value = '无效';
        }
        return value;
    },
    getMenuCodeValueStore(){
        return global.menuStore;
    },
    flashRoleStore(){
        loadRoleStore();
    },
    getRoleStore() {
        return global.roleStore;
    },
    flashDistributeStore() {
        loadDistributeResourceStore();
    },
    getDistributeStore() {
        return global.distributeStore;
    },
    flashUserPermission() {
        loadUserPermission();
    },
    setUserPermissions(userPermissions) {
        global.userPermission = userPermissions;
    },
    getUserPermissions() {
        if (tools.isEmpty(global.userPermission)) {
            loadUserPermission();
        }
        return global.userPermission;
    }

}
