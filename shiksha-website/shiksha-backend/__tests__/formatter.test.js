const mongoose = require('mongoose');
const {
	restructureResources,
	sortDataBySubTopics,
	convertToCamelCase
} = require('../helper/formatter');

describe('formatter helper', () => {
	describe('restructureResources', () => {
		it('reshapes resource sections for question bank, real world scenarios and activities', () => {
			const input = {
				questionbank: {
					easy: {
						mcq: { content: [{ id: 1 }] }
					}
				},
				realworldscenarios: {
					medium: {
						topic1: {
							title: 'Daily Life',
							scenario: {
								question: 'How do we conserve water?',
								description: 'Discuss practical conservation tips.'
							}
						}
					}
				},
				activities: {
					act1: { name: 'Water Audit' }
				}
			};

			const result = restructureResources(input);

			expect(result).toEqual([
				{
					section: 'questionbank',
					data: [
						{
							difficulty: 'easy',
							content: [
								{
									type: 'mcq',
									questions: [{ id: 1 }]
								}
							]
						}
					]
				},
				{
					section: 'realworldscenarios',
					data: [
						{
							difficulty: 'medium',
							content: [
								{
									title: 'Daily Life',
									question: 'How do we conserve water?',
									description: 'Discuss practical conservation tips.'
								}
							]
						}
					]
				},
				{
					section: 'activities',
					data: [
						{
							id: 'act1',
							name: 'Water Audit'
						}
					]
				}
			]);
		});
	});

	describe('sortDataBySubTopics', () => {
		it('prioritises the all entry and sorts numeric prefixes correctly', () => {
			const input = [
				{ _id: 'a1', isAll: false, subTopics: ['10 Geometry'] },
				{ _id: 'a2', isAll: true, subTopics: ['All Topics'] },
				{ _id: 'a3', isAll: false, subTopics: ['2.1 Fractions'] },
				{ _id: 'a4', isAll: false, subTopics: ['2.10 Mixed Numbers'] }
			];

			const result = sortDataBySubTopics(input);

			expect(result.map((item) => item._id)).toEqual(['a2', 'a3', 'a4', 'a1']);
		});
	});

	describe('convertToCamelCase', () => {
		it('recursively converts object keys and normalises ObjectId values', () => {
			const firstId = new mongoose.Types.ObjectId();
			const nestedId = new mongoose.Types.ObjectId();

			const input = {
				_id: firstId,
				student_name: 'Asha',
				student_details: {
					grade_level: 5,
					favorite_subjects: [
						'maths',
						{
							_id: nestedId,
							nested_key: 'value'
						}
					]
				}
			};

			const result = convertToCamelCase(input);

			expect(result).toEqual({
				_id: firstId.toHexString(),
				studentName: 'Asha',
				studentDetails: {
					gradeLevel: 5,
					favoriteSubjects: [
						'maths',
						{
							_id: nestedId.toHexString(),
							nestedKey: 'value'
						}
					]
				}
			});
		});
	});
});
