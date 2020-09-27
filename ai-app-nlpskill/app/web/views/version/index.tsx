import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Divider, Modal } from 'antd';

import { switchVersion, rollbackVersion } from '../../api/version';
import { TableManage } from '../../components/TableManage';
import { TableColumns } from '../../components/TableColumns';
import { VersionModal } from './components/versionmodal';
import { transferTime2CN } from '../../util/time';
import { useStore } from '../../store';

export const Version = () => {
	const [visible, setVisible] = useState(false);
	const [ability, setAbility] = useState<any>();
	const [versionList, setVersionList] = useState();
	const { AbilityC } = useStore( );
	const [url, setUrl] = useState('');
	const [reload, setReload] = useState(false);
	const tableRef = useRef(null);
	const timerRef: any = useRef();

	useEffect(() => {
		const item = AbilityC.selectAbility;
		item && setAbility(item);
		setUrl(`/t-apis/v1/nlp/version/${item.algorithmn_id}`);
		timerRef.current = setInterval(() => setReload(reload => !reload), 20000);
		return () => clearInterval(timerRef.current);
	}, [])

  const columns = useMemo(() => TableColumns({
		version_name: "版本",
		created_at: {
			title: "创建时间",
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
		updated_at: {
			title: "更新时间",
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
		description: "版本描述",
	}, {
		customs: [{
			render: (record) =>
				record.version_name === '开发版本' ?
					<a onClick={ handleSave }>版本保存</a>:
					<>
						<a onClick={ () => {
							Modal.confirm({
								title: '确认执行回滚操作？',
								okText: '确认',
								cancelText: '取消',
								onOk: () => {
									handleRollBack(record)
								}
							});
						}}>配置回滚</a>
						{
							!record.is_deploy &&
							<>
								<Divider type="vertical" />
								<a onClick={ () => {
									Modal.confirm({
										title: '确认发布？',
										okText: '确认',
										cancelText: '取消',
										onOk: () => {
											handleSwitch(record)
										}
									});
								} }>能力发布</a>
							</>
						}
					</>
		}]
	}), [versionList, reload]);

	const handleSave = () => {
		timerRef.current && clearInterval(timerRef.current);

		const current: any = tableRef.current;
    const list = current && current.getData() || [];
		setVersionList(list);
		setVisible(true);
	};

	// 切换正式部署版本
	const handleSwitch = (record) => {
		switchVersion(record.nlp_ability_id, { version_id: record.version_id }).then(res => {
			if (res.status && res.status === 200) setReload(!reload);
		})
	}

	// 回滚
	const handleRollBack = (record) => {
		rollbackVersion(record.nlp_ability_id, { src_version_id: record.version_id }).then(res => {
			if (res.status && res.status === 200) setReload(!reload);
		})
	}

	const onClose = () => {
		setVisible(false);
		setReload(!reload);
		timerRef.current = setInterval(() => setReload(reload => !reload), 10000);
	}

  return (
    <div className="version">
			{
				url&&
				<TableManage
					ref={tableRef}
          url={url}
					columns={columns}
					baseprops={{ rowKey: 'version_id' }}
				/>
			}
			{
				visible &&
				<VersionModal
					title="版本保存"
					ability={ability}
					visible={visible}
					versionList={versionList}
					onClose={onClose} />
			}
    </div>
  );
};
