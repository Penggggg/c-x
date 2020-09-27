import React, { useRef, useMemo } from 'react';
import { PageHeader, Card, Button, Divider, Icon, Tooltip, Alert } from 'antd';
import { FormManage } from '../../components/FormManage';
import { TableManage } from '../../components/TableManage';
import { TableColumns } from '../../components/TableColumns';
import './index.less';
import { spawn } from 'child_process';

const MessageForm = FormManage('message-form');
const ClearForm = FormManage('clear-form');
const UserForm = FormManage('user-form');
const EndForm = FormManage('end-form');
const JumpForm = FormManage('jump-form');

export const Preference = () => {
	const messageFormRef = useRef< any >( null );
	const clearFormRef = useRef< any >( null );
	const userFormRef = useRef< any >( null );
	const endFormRef = useRef< any >( null );
	const jumpFormRef = useRef< any >( null );

  const messageForm = useMemo(() => {
		return [
			{
				key: 'trigger',
				label: '触发条件',
				placeholder: '请输入触发条件',
				prefix: '#',
        rules: [{ required: true, message: '请输入触发条件' }]
			},
			{
				key: 'address',
				label: '消息投递地址',
        type: 'textarea',
			},
			{
				key: 'preview',
				label: '消息体预览',
        type: 'textarea',
			}
		]
	}, [])

	const clearForm = useMemo(() => {
		return [
			{
				key: 'question',
				label: '询问话术',
				placeholder: '请输入询问话术',
        rules: [{ required: true, message: '请输入询问话术' }]
			},
			{
				key: 'number',
				label: '选项个数',
        type: 'inputnumber',
			},
			{
				key: 'refuse',
				label: (
					<>
						<span>全否定选项</span>
						<span style={{ color: 'rgba(0, 0, 0, .45)' }}>
							（当我们列出来的意图选项都不满足用户需求时，用户可用此选项反馈）
						</span>
					</>
				)
			}
		]
	}, [])

	const userForm = useMemo(() => {
		return [
			{
				key: 'tag',
				label: '用户唯一标识',
				placeholder: '请输入用户唯一标识',
        rules: [{ required: true, message: '请输入用户唯一标识' }]
			},
			{
				key: 'property',
				label: '用户显示属性',
			},
		]
	}, [])

	const endForm = useMemo(() => [{ key: 'endtrigger', label: '触发条件', prefix: '#' }], [])
	const jumpForm = useMemo(() => [{ key: 'believe', label: (
		<>
			<span>置信阈值</span>
			<span style={{ color: 'rgba(0, 0, 0, .45)' }}>（当确认事件的所有事件的置信阈值均值大于以下值时则跳过）</span>
		</>
	), type: 'inputnumber' }], [])

	const formProperty = { colon: false, labelCol: 24, wrapperCol: 24 };


	const cardItem = [
		{
			title: '消息转发',
			tootip: '适用于当对话系统无法处理需要借助外部系统协同处理的场景，比如人工客服系统',
			formItem: <MessageForm items={messageForm} ref={messageFormRef} {...formProperty} /> ,
		},
		{
			title: '消除歧义',
			tootip: '适用于用户的问题没法没对话系统很好理解时，需要与用户进行澄清问题的场景',
			formItem: <ClearForm items={clearForm} ref={clearFormRef} {...formProperty} /> ,
		},
		{
			title: '用户接入',
			tootip: '用于表达对话系统如何从用户画像中获取用户的属性，方便在聊天记录等查看消息归属人',
			formItem: <UserForm items={userForm} ref={userFormRef} {...formProperty} /> ,
		},
		{
			title: '结束会话',
			tootip: '当用户触发某个条件时，整个会话会销毁，适用于用户需要手动结束整个会话的场景',
			formItem: <EndForm items={endForm} ref={endFormRef} {...formProperty} /> ,
		},
		{
			title: '跳过确认',
			tootip: '通过配置来选择性跳过准备答复阶段的确认环节',
			formItem: <JumpForm items={jumpForm} ref={jumpFormRef} {...formProperty} /> ,
		}
	];

  return (
    <div className="preference">
			<Alert
				// closable
				// showIcon
				type="info"
				className="alert-msg"
				message="偏好设置可对对话能力做一定的定制化。比如投递消息到人工客服系统；当用户的意图不明时，与用户发起“您的意思是...”之类的澄清话术；选择哪个上下文变量作为接入用户的名称"
			/>
			{
				cardItem && cardItem.map(item => (
					<Card
						size="small"
						bordered={false}
						bodyStyle={{ width: '60%', marginLeft: 70 }}
						key={item.title}
						title={
							<div className="card-title">
								<span className="card-title">{item.title}</span>
								<Tooltip title={item.tootip}>
									<Icon type="question-circle" />
								</Tooltip>
							</div>
						}
					>
						{item.formItem}
					</Card>
				))
			}
    </div>
  );
};
