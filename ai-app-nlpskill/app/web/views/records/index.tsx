import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { DatePicker, Drawer, Empty, Input } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import moment from 'moment';

import { TableColumns } from '../../components/TableColumns';
import { NlpChat, NlpDialogAdjust } from '../../containers';
import { TableManage } from '../../components/TableManage';
import { transferTime2CN } from '../../util/time';
import { useStore } from '../../store';
import './index.less';

export const Records = () => {
	const { AbilityC } = useStore( );
	const [fetchParams, setFetchParams] = useState<any>();
	const [ability, setAbility] = useState<any>();
	const [visible, setVisible] = useState<boolean>(false);
	const [records, setRecords] = useState<any>([]);

	useEffect(() => {
		const item = AbilityC.selectAbility;
		setAbility(item);
		setFetchParams({
			...fetchParams,
			dialog_id: item.algorithmn_id,
			start_time: moment(new Date()).subtract(1, 'days').format().split('+')[0],
			end_time: moment(new Date()).format().split('+')[0]
		})
	}, [])

  const columns = useMemo(() => TableColumns({
		user_id: {
			title: "用户",
			ellipsis: true,
		},
		session_id: {
			title: "Session ID",
			ellipsis: true,
			render: (text, record) => <a title={text} onClick={() => {
				http.get({
					url: `/t-apis/v1/data_record/chat_record/${record.session_id}`,
					params: { dialog_id: ability.algorithmn_id }
				}).then(res => {
					const data: any = res.data;
					setRecords(data.instances);
				})
				setVisible(true)
			}}>{text}</a>
		},
		chat_content: "聊天内容",
		update_time: {
			title: "最后更新时间",
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
	}), [ability, fetchParams]);

	// 修改日期
	const onDateChange = (date, type) => {
		if (!date) {
			let params = JSON.parse(JSON.stringify(fetchParams));
			delete params[type];
			setFetchParams(params);
		}
	}

	// 时间筛选
	const onOk = (date, type) => {
		let params = JSON.parse(JSON.stringify(fetchParams));
		params[type] = date.format().split('+')[0];
		setFetchParams(params);
	}

	// 日期禁用范围 start
	const disabledStartDate = current => {
		if (!fetchParams.end_time) return false;
		return current.format() > fetchParams.end_time;
	}

	// 日期禁用范围 end
	const disabledDate = current => {
		if (!fetchParams.start_time) return false;
		return current.format() < fetchParams.start_time;
	}

	/** 根据show_type组装内容 */
	const setUpShowType = ( outputItem: any ) => {
		const { show_type, content } = outputItem;
		if ( show_type === 'text' ) {
				return (
						<div>
								<p>
										【文字】
								</p><br />
								<pre style={{ width: '100%', whiteSpace: 'pre-line' }}>{ content.text }</pre>
						</div>
				)
		} else if ( show_type === 'option' || show_type === 'my_option' ) {
				return (
						<div>
								<p>
										【选项】
								</p><br />
								<p>{ content.title || content.description }</p><br />
								{
										(content.my_option || [ ]).map( (x: any, index) => (
												<p key={index}>{ x.label }</p>
										))
								}
						</div>
				)
		} else if ( show_type === 'rich_text' ) {
				return (
						<div>
								<p>
										【富文本】
								</p><br />
								<div
										dangerouslySetInnerHTML={{ __html: content.text || '' }}
								>
								</div>
						</div>
				)
		} else if ( show_type === 'image' ) {
				return (
						<div>
								<p>
										【图片】
								</p><br />
								<img src={ content.url } />
						</div>
				)
		} else if ( show_type === 'intent' ) {
				return (
						<div>
								<p>
										【意图默认回复】
								</p><br />
								<p>{ content.text }</p>
						</div>
				)
		} else if ( show_type === 'pause' ) {
				return (
						<div>
								<p>
										【暂停 { content.duration }ms】
								</p><br />
								<p>{ content.tips }</p>
						</div>
				)
		}
		return <div></div>
}

	/** 聊天框 */
	const chats$: Chat[ ] = useMemo(( ) => {
		const result: Chat[ ] = [ ];
		records.map(r => {
			const { user_input, output } = r;
			if (user_input.hit_intent && user_input.hit_intent.intents) {
				const intents = user_input.hit_intent.intents[0];
				result.push({
					pos: 'right',
					content: (<NlpDialogAdjust
						content={ user_input.content }
						abilityId={ ability.algorithmn_id }
						intentScore={ intents.confidence }
						intent={ intents.intent }
				/>)
				})
			} else {
				result.push({
					pos: 'right',
					content: user_input.content
				})
			}
			const content = setUpShowType(output);
			result.push({
				pos: 'left',
				content
			})
		})
		return result;
}, [ records ]);

  return (
    <div className="records">
			<div style={{ marginBottom: 20 }}>
				<Input.Search
					enterButton
					allowClear
					placeholder="请输入要搜索的内容"
					style={{ width: 300, marginRight: 30 }}
					onSearch={value => {
						let params = JSON.parse(JSON.stringify(fetchParams));
						params['search_info'] = value;
						setFetchParams(params);
					}}
				/>
				<span>开始时间：</span>
				<DatePicker
					showTime
					style={{ marginRight: 20 }}
					locale={locale}
					defaultValue={moment(new Date()).subtract(1, 'days')}
					disabledDate={disabledStartDate}
					onOk={(date) => onOk(date, 'start_time')}
					onChange={(date) => onDateChange(date, 'start_time')}
				/>
				<span>结束时间：</span>
				<DatePicker
					showTime
					locale={locale}
					defaultValue={moment(new Date())}
					onChange={(date) => onDateChange(date, 'end_time')}
					disabledDate={disabledDate} onOk={(date) => onOk(date, 'end_time')}
				/>
			</div>
			{
				fetchParams &&
				<TableManage
					columns={columns}
					url={`/t-apis/v1/data_record/chat_record`}
					fetchParams={fetchParams}
					baseprops={{
						rowKey: 'session_id'
					}}
				/>
			}
			<Drawer
				title="聊天记录详情"
				width="500"
				visible={visible}
				onClose={() => {
					setVisible(false);
					setRecords([]);
				}}
			>
				{
					chats$ && chats$.length !== 0 ?
					<NlpChat chats={ chats$ } />:
					<Empty />
				}
			</Drawer>
    </div>
  );
};

type Chat = {
	content?: string | ReactNode
	session_id?: string
	pos: 'left' | 'right',
	time?: any,
	meta?: any
}
