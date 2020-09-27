declare type normalResult<T> = {
    data: T,
    status: number,
    message: string,
}

/** 接口信息 */
declare namespace Api {

    export namespace get {

        /** 微信账号的信息 */
        export type wxData = normalResult<App.wxAccount>

        /** csb数据字典 */
        export type csbDic = normalResult<{
            [ key: string ]: {
                attribute1: string
                attribute2: string
                attribute3: string
                code: string
                itemValue: string
                name: string

            }[ ]
        }>

        /** 获取门诊的可预约日期 */
        export type bookingScheduleDate = normalResult<{
            /** 已过期 */
            passedDayList: string[ ],
            /** 未开放 */
            unConfiguredList: string[ ],
            /** 不可用 */
            unavailableDays: string[ ]
        }>

        /** 获取门诊的可预约时间 */
        export type bookingScheduleTime = normalResult<{
            [ key: string ]: number
        }>

        /** 获取门诊的预约记录 */
        export type bookingRecord = normalResult<{
            id: string,
            name: string,
            sex: string,
            age: string,
            shopId: string,
            shopName: string,
            doctorName: string,
            reservationTime: string,
            department: string,
            reservationContent: string,
            cancelReason: string,
            canModify: boolean,
            reservationType: string
        }[ ]>

        /** 门诊体检报告列表 */
        export type clinicRecordList = normalResult<{
            id: string,
            name: string,
            sex: string,
            medicalSite: string,
            medicalNo: string,
            userId: string,
            userArchiveId: string,
            medicalId: string,
            medicalType: string,
            beginMedicalDate: number,
            contact: null,
            contactName: null,
            contactTel: null,
            relationship: null,
            medicalGroup: string,
            companyName: string,
            traceLevel: null,
            processStatus: null,
            medicalDate: number,
            batchName: string,
            groupName: string,
            crtTime: number,
            isSummary: string,
            summarySuggest: string,
            medicalResult: string,
            medicalItems: null,
            medicalDiseases: null,
            abnormalItemMap: null
        }[ ]>

        /** 门诊体检报告详情 */
        export type clinicRecordDetail = normalResult<{
            id: string,
            medicalNo: string,
            userId: string,
            userArchiveId: string,
            medicalId: string,
            medicalType: string,
            beginMedicalDate: number,
            contact: null,
            contactName: null,
            contactTel: null,
            relationship: null,
            medicalGroup: string,
            companyName: string,
            traceLevel: null,
            processStatus: null,
            medicalSite: string,
            medicalDate: number,
            batchName: string,
            groupName: string,
            crtTime: number,
            isSummary: string,
            summarySuggest: string,
            medicalResult: string,
            medicalItems: null,
            medicalDiseases: {
                id: string,
                medicalReportId: string,
                diseaseId: string,
                diseaseName: string,
                sex: string,
                isDisease: string,
                isChronic: string,
                isOccupationDisease: string,
                diseaseExplain: null,
                suggestContent: string
            }[ ],
            abnormalItemMap: {
                [ key: string ]: {
                    id: string,
                    medicalReportId: string,
                    itemId: string,
                    itemName: string,
                    deptId: string,
                    deptName: string,
                    medicalValue: string,
                    tipsContent: string,
                    isYang: string,
                    referenceRange: string,
                    crtTime: number
                }[ ]
            }
        }>

        /** 健康卡预约 排期*/
        export type healthCardDate = normalResult<{
            date: number,
            isScheduling: boolean,
            appointmentNumber: number,
            appointmentMaxLimit: number
        }[ ]>

        /** 健康卡预约 推荐套餐 */
        export type healthCardPackage = normalResult<{
            cardTemplateName: string,
            cardPrice: number,
            packages: {
                disease: null,
                maxEnd: number,
                minAge: number,
                cardTemplateId: string,
                maritalStatus: string,
                packageName: string,
                packageId: string,
                gender: string,
                id: null
            }[ ]
        }>

        /** 健康卡预约列表 */
        export type healthCardRecordList = normalResult<App.healthCardRecord[ ]>

    }

    export namespace post {
     
        /** 验证码的调用与校验 */
        export type verifyCode = normalResult<{
            null
        }>

    }

}

/** 全局的数据类型 */
declare namespace App {

    /** 微信账号相关 */
    export type wxAccount = {
        appid: string,
        openid: string,
        avatar: string
    }

    /** 系统账号相关 */
    export type systemUser = {
        id: string,
        name: string,
        birthday: string,
        domainName: string,
        gender: string,
        userType: string,
        email: string,
        telephone: string,
        maritalStatus: null,
        identityCard: string,
        company: string
    };

    /** 体检就诊人 */
    export type bodyCheckVisitor = {
        id?: string,
        userArchiveId?: string,
        cardNumber?: string,
        name?: string,
        sexCode?: string,
        birthDate?: number,
        mobileNumber?: string,
        marriage?: null,
        crtTime?: number,
        updTime?: null
    };

    /** 预约记录 */
    export type bodyCheckRecord = {
        id: string
        stage?: string
        place?: string
        department?: string
        status?: string | 'done' | 'ing' | 'cancel'
        time?: string,
        canCancel?: boolean,
        name?: string,
        sex?: string,
        age?: string,
        desc?: string,
        shopId?: string
        cancelReason?: string
    }[ ];

    /** 体检报告item */
    export type bodyCheckListItem = {
        id?: string,
        name?: string,
        sex?: string,
        time?: string,
        department?: string,
        number?: string
    }

    /** 体检报告结论 - 异常指标 */
    export type bodyCheckResultAbnormalItem = {
        id?: string,
        belong?: string,
        items?: {
            tips?: string,
            name?: string,
            difference?: string
            reference?: string
        }[ ]
    }

    /**  体检报告结论 -体检异常 - 解释 */
    export type bodyCheckResulteEplanationItem = {
        name?: string,
        params?: {
            title: string,
            param: string
        }[ ]
    }

    /** 体检报告结论 - 体检结论 */
    export type bodyCheckResulteSummaryItem = {
        title?: string
        param?: string
    }

    /** 体检报告结论 - 体检建议 */
    export type bodyCheckResulteSuggestItem = {
        title?: string
        param?: string
    }

    /** 体检报告详情 - 检验结果 */
    export type bodyCheckResulteItem = {
        title?: string,
        content?: {
            tips?: string,
            name?: string,
            difference?: string
            reference?: string
        }[ ]
    };

    /** 健康卡列表item */
    export type healthCard = {
        id: string,
        isUse: boolean,
        cardNumber: string,
        publishChannel: string,
        serviceDuration: number,
        cardState: string,
        template: {
            cardTemplateName: string,
            cardPrice: number,
            cardImgId: string,
            introduceImgId: string,
            serviceDesc: string,
            packages: undefined[ ],
            tagsList: {
                tagName: string
            }[ ]
        }
    }

    /** 健康卡详情 */
    export type healthCardDetail = {
        id: string,
        cardNumber: string,
        publishChannel: string,
        serviceDuration: number,
        cardState: string,
        template: {
            scheduleType: string
            cardTemplateName: string,
            cardTemplateNumber: string,
            cardPrice: number,
            offerAgency: string,
            serviceDuration: number,
            serviceType: string,
            serviceDetail: string,
            cardImgId: string,
            introduceImgId: string,
            serviceDesc: string,
            packages: {
                packageName: string,
                packageId: string
            }[ ],
            state: string,
            crtTime: null,
            tagsList: {
                tagName: string
            }[ ]
        },
        isUse: boolean,
        ext: any
    }

    /** 健康卡推荐套餐 */
    export type healthCardPackage = {
        cardTemplateName: string,
        cardPrice: number,
        packages: {
            disease: null,
            maxEnd: number,
            minAge: number,
            cardTemplateId: string,
            maritalStatus: string,
            packageName: string,
            packageId: string,
            gender: string,
            id: null
        }[ ]
    }

    /** 健康卡预约记录 */
    export type healthCardRecord = {
        id: string,
        appointmentTime: number,
        cardNumber: string,
        cancelReason: null,
        cancelTime: null,
        cardTemplateName: string,
        medicalSiteName: string,
        state: string
    }

}