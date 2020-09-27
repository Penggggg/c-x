import dev from './dev';
import fat from './fat';
import uat from './uat';
import prod from './prod';

const env: envs = 'prod';

const configSet = {
    dev,
    fat,
    uat,
    prod
};

type envs = 'dev' | 'fat' | 'uat' | 'prod';

export default configSet[ env ];

