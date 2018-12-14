# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.core.validators import MaxValueValidator


class News(models.Model):
    title = models.CharField(primary_key=True, max_length=255)
    source = models.CharField(max_length=255, blank=True, null=True)
    sentiment_number = models.CharField(max_length=255, blank=True, null=True)
    sentiment_result = models.CharField(max_length=255, blank=True, null=True)
    article_url = models.CharField(max_length=255, blank=True, null=True)
    target_word = models.CharField(max_length=255, blank=True, null=True)
    published_time = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'NEWS'


class MainNews(models.Model):
    source = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    article_url = models.TextField()
    sentiment_result = models.CharField(max_length=255)
    sentiment_number = models.DecimalField(max_digits=5, decimal_places=3)
    published_time = models.DateTimeField(blank=True, null=True)
    target_word = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'main_news'

class Sentiment(models.Model):
    time = models.CharField(primary_key=True, max_length=255)
    # sentibywsj_bitcoin = models.CharField(max_length=255, blank=True, null=True)
    sentibywsj_bitcoin = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibywsj_blockchain = models.CharField(max_length=255, blank=True, null=True)
    sentibywsj_blockchain = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibycnn_bitcoin = models.CharField(max_length=255, blank=True, null=True)
    sentibycnn_bitcoin = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibycnn_blockchain = models.CharField(max_length=255, blank=True, null=True)
    sentibycnn_blockchain = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibyreuters_bitcoin = models.CharField(db_column='sentibyReuters_bitcoin', max_length=255, blank=True, null=True)  # Field name made lowercase.
    sentibyreuters_bitcoin = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibyreuters_blockchain = models.CharField(db_column='sentibyReuters_blockchain', max_length=255, blank=True, null=True)  # Field name made lowercase.
    sentibyreuters_blockchain = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibyft_bitcoin = models.CharField(db_column='sentibyFT_bitcoin', max_length=255, blank=True, null=True)  # Field name made lowercase.
    sentibyft_bitcoin = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # sentibyft_blockchain = models.CharField(db_column='sentibyFT_blockchain', max_length=255, blank=True, null=True)  # Field name made lowercase.
    sentibyft_blockchain = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # daily_senti_average = models.CharField(max_length=255, blank=True, null=True)
    daily_senti_average = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # open = models.CharField(max_length=255, blank=True, null=True)
    open = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # high = models.CharField(max_length=255, blank=True, null=True)
    high = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # low = models.CharField(max_length=255, blank=True, null=True)
    low = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # close = models.CharField(max_length=255, blank=True, null=True)
    close = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    
    # volume = models.CharField(max_length=255, blank=True, null=True)
    volume = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True, validators=[MaxValueValidator(10)])    

    class Meta:
        db_table = 'SENTIMENT'        



class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'

