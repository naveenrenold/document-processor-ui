select * from form

insert into form values ('1', '2','3','Test2','Test2 Address', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(),'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), '2', '7358639622', '7358639621')

update form set StatusId = '2'
select * from Attachment
--100089


insert into Attachment values ('100090', 'file1.pdf', 'file1.pdf','NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(),'application/pdf', 2000)
insert into Attachment values ('100090', 'file2.pdf', 'file2.pdf','NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(),'application/pdf', 3000)

select * from activity;

select * from activityType;

insert into activity VALUES(100090, 1, '', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), 'Form', '', '')

insert into activity VALUES(100090, 2, '', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), 'CustomerName', 'Test1', 'Test2')

insert into activity VALUES(100090, 3, '', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), 'Form', '', '')

insert into activity VALUES(100090, 4, '', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), 'FileName', '', 'file1.pdf, file2.pdf,file3.pdf')

insert into activity VALUES(100090, 5, '', 'NaveenRenold@navigatorxdd.onmicrosoft.com', getdate(), 'FileName', 'file1.pdf', '')


DECLARE @Id int = 100090,
@ActivityTypeId int = 1,
@Comments nvarchar(100) = 'Test Comments',
@CreatedBy nvarchar(100) = 'NaveenRenold@navigatorxdd.onmicrosoft.com',
@CreatedOn datetime = getdate(),
@Field nvarchar(100) = 'TestField',
@OldValue nvarchar(100) = 'OldValue',
@NewValue nvarchar(100) = 'NewValue';

INSERT INTO activity (Id, ActivityTypeId, Comments, CreatedBy, CreatedOn, Field, OldValue, NewValue)
VALUES (@Id, @ActivityTypeId, @Comments, @CreatedBy, @CreatedOn, @Field, @OldValue, @NewValue);


